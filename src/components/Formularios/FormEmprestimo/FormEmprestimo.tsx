import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmprestimoRequests from '../../../fetch/EmprestimoRequests';
import AlunoRequests from '../../../fetch/AlunoRequests'; 
import LivroRequests from '../../../fetch/LivroRequests'; 
import type EmprestimoDTO from '../../../dto/EmprestimoDTO';
import type AlunoDTO from '../../../dto/AlunoDTO'; 
import type LivroDTO from '../../../dto/LivroDTO'; 
import Utilitario from '../../../utils/Utilitario';

function FormEmprestimo() {
    const navigate = useNavigate();

    // Estados para armazenar as listas vindas do banco de dados
    const [listaAlunos, setListaAlunos] = useState<AlunoDTO[]>([]);
    const [listaLivros, setListaLivros] = useState<LivroDTO[]>([]);

    const [formData, setFormData] = useState<EmprestimoDTO>({
        id_emprestimo: 0,
        aluno: { id_aluno: 0 },
        livro: { id_livro: 0 },
        data_emprestimo: new Date(),
        data_devolucao: undefined,
        status_emprestimo: 'ATIVO',
        status_emprestimo_registro: true
    });

    const [dataEmprestimoStr, setDataEmprestimoStr] = useState<string>(Utilitario.formatarDataParaInput(new Date()));
    const [dataDevolucaoStr, setDataDevolucaoStr] = useState<string>('');

    // Busca os Alunos e Livros cadastrados ao carregar a página
// Busca os Alunos e Livros cadastrados ao carregar a página
useEffect(() => {
    const carregarDados = async () => {
        try {
            // Chamando o método exato que você tem na sua classe AlunoRequests
            const alunos = await AlunoRequests.obterListaDeAlunos(); 
            
            // Supondo que seu LivroRequests siga o mesmo padrão de nomenclatura:
            const livros = await LivroRequests.obterListaDeLivros(); 
            
            if (alunos) setListaAlunos(alunos);
            if (livros) setListaLivros(livros);
        } catch (error) {
            console.error("Erro ao carregar dados para o empréstimo:", error);
            alert("Erro ao carregar listas de alunos ou livros.");
        }
    };

    carregarDados();
}, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === 'id_aluno') {
            setFormData(prev => ({
                ...prev,
                aluno: { ...prev.aluno, id_aluno: Number(value) }
            }));
            return;
        }

        if (name === 'id_livro') {
            setFormData(prev => ({
                ...prev,
                livro: { ...prev.livro, id_livro: Number(value) }
            }));
            return;
        }

        if (name === 'data_emprestimo') {
            setDataEmprestimoStr(value);
            return;
        }
        if (name === 'data_devolucao') {
            setDataDevolucaoStr(value);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.aluno.id_aluno <= 0) {
            alert("Por favor, selecione um Aluno.");
            return;
        }

        if (formData.livro.id_livro <= 0) {
            alert("Por favor, selecione um Livro.");
            return;
        }

        if (!dataEmprestimoStr) {
            alert("A data de empréstimo é obrigatória.");
            return;
        }

        const dateEmprestimo = new Date(dataEmprestimoStr);
        let dateDevolucao: Date | undefined = undefined;

        if (dataDevolucaoStr) {
            dateDevolucao = new Date(dataDevolucaoStr);
            if (dateDevolucao < dateEmprestimo) {
                alert("A data de devolução não pode ser anterior à data de empréstimo.");
                return;
            }
        }

        const payload: EmprestimoDTO = {
            ...formData,
            data_emprestimo: dateEmprestimo,
            data_devolucao: dateDevolucao
        };

        const resposta = await EmprestimoRequests.enviarFormularioEmprestimo(payload);
        
        if (resposta) {
            alert("Empréstimo registrado com sucesso!");
            navigate('/lista/emprestimos');
        } else {
            alert("Erro ao registrar o empréstimo.");
        }
    };

    return (
        <main className="bg-gray-100 flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-200">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold text-slate-800 mb-8 sm:mb-12">
                        Registrar Empréstimo
                    </h1>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Linha 1: Seleção de Aluno e Seleção de Livro por Nome */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label htmlFor="id_aluno" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Aluno Responsável
                                </label>
                                <select
                                    name="id_aluno"
                                    id="id_aluno"
                                    required
                                    value={formData.aluno.id_aluno || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:border-slate-500 focus:outline-none transition-all"
                                >
                                    <option value="">Selecione um aluno...</option>
                                    {listaAlunos.map(aluno => (
                                        <option key={aluno.id_aluno} value={aluno.id_aluno}>
                                            {aluno.nome} {aluno.sobrenome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label htmlFor="id_livro" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Livro
                                </label>
                                <select
                                    name="id_livro"
                                    id="id_livro"
                                    required
                                    value={formData.livro.id_livro || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:border-slate-500 focus:outline-none transition-all"
                                >
                                    <option value="">Selecione um livro...</option>
                                    {listaLivros.map(livro => (
                                        <option key={livro.id_livro} value={livro.id_livro}>
                                            {livro.titulo} (Autor: {livro.autor})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Linha 2: Datas */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label htmlFor="data_emprestimo" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Data do Empréstimo
                                </label>
                                <input
                                    type="date"
                                    name="data_emprestimo"
                                    id="data_emprestimo"
                                    required
                                    value={dataEmprestimoStr}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="flex-1">
                                <label htmlFor="data_devolucao" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Previsão de Devolução (Opcional)
                                </label>
                                <input
                                    type="date"
                                    name="data_devolucao"
                                    id="data_devolucao"
                                    value={dataDevolucaoStr}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-slate-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Linha 3: Status */}
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex-1">
                                <label htmlFor="status_emprestimo" className="block text-sm font-semibold text-slate-700 mb-2">
                                    Situação do Registro
                                </label>
                                <select
                                    name="status_emprestimo"
                                    id="status_emprestimo"
                                    value={formData.status_emprestimo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:border-slate-500 focus:outline-none transition-all"
                                >
                                    <option value="Em andamento">Em andamento</option>
                                    <option value="Atrasado">Atrasado</option>
                                    <option value="Concluído"> Concluido</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 sm:mt-14 space-y-4">
                        <input
                            type="submit"
                            value="CONFIRMAR EMPRÉSTIMO"
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg cursor-pointer hover:bg-slate-700 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                        />
                        <button
                            type="button"
                            onClick={() => navigate('/lista/emprestimos')}
                            className="w-full bg-white border-2 border-slate-300 text-slate-600 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-[0.98]"
                        >
                            VOLTAR PARA LISTAGEM
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
export default FormEmprestimo;