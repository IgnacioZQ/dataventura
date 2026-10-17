// En Base44 existían cuentas de la plataforma, además de las sesiones propias de estudiantes e instructores
// (página Acceso, guardadas como studentSession / instructorSession). Sin Base44 solo quedan esas sesiones:
// este hook nunca entrega un usuario de plataforma, y las pantallas siguen su camino con la sesión propia.
const SIN_USUARIO = Object.freeze({ user: null, isAuthenticated: false, isLoadingAuth: false });

export const useAuth = () => SIN_USUARIO;
