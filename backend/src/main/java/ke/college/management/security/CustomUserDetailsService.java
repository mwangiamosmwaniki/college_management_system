package ke.college.management.security;

import ke.college.management.users.entity.User;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrIdentifier(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with identifier or email: " + username));

        boolean isActive = "ACTIVE".equalsIgnoreCase(user.getStatus());
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now())) {
            isActive = false;
        }

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            role.getPermissions().forEach(perm -> {
                authorities.add(new SimpleGrantedAuthority(perm.getCode()));
            });
        });

        return CustomUserDetails.builder()
                .id(user.getId())
                .institutionId(user.getInstitutionId())
                .identifier(user.getIdentifier())
                .email(user.getEmail())
                .password(user.getPasswordHash())
                .fullName(user.getFullName())
                .active(isActive)
                .authorities(authorities)
                .build();
    }
}
