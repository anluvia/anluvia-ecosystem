export type TipoRol = 'admin' | 'especialista' | 'recepcion' | 'editor';

export interface UsuarioEquipo {
  id: string;
  nombre: string;
  email: string;
  clave: string;
  roles: TipoRol[];
}