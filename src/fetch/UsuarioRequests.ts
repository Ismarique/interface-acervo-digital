// Classe responsável por fazer requisições à API - usuários
// Classe responsável por fazer requisições à API - usuários
class UsuarioRequests {
    private serverUrl: string;
    private endpointListarUsuarios: string;

    constructor() {
        this.serverUrl = 'http://localhost:3333';
        this.endpointListarUsuarios = '/api/usuario';
    }

    async listarUsuarios() {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${this.serverUrl}${this.endpointListarUsuarios}`, {
                headers: {
                    'x-access-token': `${token}`
                }
            });

            if(!response.ok) {
                throw new Error('Não foi possível listar as usuarios.');
            }

            return response.json();
        } catch (error) {
            console.error(`Erro ao fazer consulta à API: ${error}`);
            return null;
        }
    }

}

export default new UsuarioRequests();