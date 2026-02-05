//package Seating.Planner.NITJ.security;
//
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureException;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//@Component
//public class JwtUtil {
//
//    @Value("${jwt.secret}")
//    private String secretKey;
//
//    /**
//     * Validate the given JWT token.
//     */
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser()
//                    .setSigningKey(secretKey)
//                    .parseClaimsJws(token);
//            return true;
//        } catch (SignatureException e) {
//            System.err.println("❌ Invalid JWT signature: " + e.getMessage());
//        } catch (Exception e) {
//            System.err.println("❌ JWT validation error: " + e.getMessage());
//        }
//        return false;
//    }
//
//    /**
//     * Extract username (or email) from JWT.
//     */
//    public String extractUsername(String token) {
//        try {
//            Claims claims = Jwts.parser()
//                    .setSigningKey(secretKey)
//                    .parseClaimsJws(token)
//                    .getBody();
//            return claims.getSubject();
//        } catch (Exception e) {
//            return null;
//        }
//    }
//}
