import { useState, useEffect } from "react";
import { type Ingresso, type Sessao, type Filme, type Sala } from "../types";

// Defina um tipo para o ingresso com todos os dados combinados
type IngressoDetalhado = Ingresso & {
  sessao: Sessao & {
    filme: Filme;
    sala: Sala;
  };
};

export function Ingressos() {
  const [ingressos, setIngressos] = useState<IngressoDetalhado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingressosRes, sessoesRes, filmesRes, salasRes] =
          await Promise.all([
            fetch("http://localhost:3000/ingressos"),
            fetch("http://localhost:3000/sessoes"),
            fetch("http://localhost:3000/filmes"),
            fetch("http://localhost:3000/salas"),
          ]);

        if (
          !ingressosRes.ok ||
          !sessoesRes.ok ||
          !filmesRes.ok ||
          !salasRes.ok
        ) {
          throw new Error("Falha ao buscar dados.");
        }

        const ingressosData: Ingresso[] = await ingressosRes.json();
        const sessoesData: Sessao[] = await sessoesRes.json();
        const filmesData: Filme[] = await filmesRes.json();
        const salasData: Sala[] = await salasRes.json();

        // Crie mapas para busca rápida
        const sessoesMap = new Map(sessoesData.map((s) => [s.id, s]));
        const filmesMap = new Map(filmesData.map((f) => [f.id, f]));
        const salasMap = new Map(salasData.map((s) => [s.id, s]));

        // Combine os dados
        const ingressosDetalhados = ingressosData.map((ingresso) => {
          const sessao = sessoesMap.get(ingresso.sessaoId);
          if (!sessao)
            throw new Error(
              `Sessão para o ingresso ${ingresso.id} não encontrada.`,
            );

          const filme = filmesMap.get(sessao.filmeId);
          if (!filme)
            throw new Error(`Filme para a sessão ${sessao.id} não encontrado.`);

          const sala = salasMap.get(sessao.salaId);
          if (!sala)
            throw new Error(`Sala para a sessão ${sessao.id} não encontrada.`);

          return {
            ...ingresso,
            sessao: {
              ...sessao,
              filme,
              sala,
            },
          };
        });

        setIngressos(ingressosDetalhados);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro desconhecido.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <strong>Erro:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Meus Ingressos</h2>

      {ingressos.length === 0 ? (
        <div className="alert alert-info">
          Você ainda não comprou nenhum ingresso.
        </div>
      ) : (
        <div className="row">
          {ingressos.map((ingresso) => (
            <div className="col-md-6 col-lg-4 mb-4" key={ingresso.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-primary">
                    <i className="bi bi-film"></i>{" "}
                    {ingresso.sessao.filme.titulo}
                  </h5>
                  <p className="card-text small mb-2">
                    {ingresso.sessao.filme.sinopse}
                  </p>
                  <div className="mt-auto">
                    <p className="mb-1">
                      <i className="bi bi-calendar-event"></i>{" "}
                      <strong>Sessão:</strong>{" "}
                      {new Date(ingresso.sessao.dataHora).toLocaleString(
                        "pt-BR",
                      )}
                    </p>
                    <p className="mb-1">
                      <i className="bi bi-door-open"></i> <strong>Sala:</strong>{" "}
                      {ingresso.sessao.sala.numero}
                    </p>
                    <p className="mb-1">
                      <i className="bi bi-ticket-perforated"></i>{" "}
                      <strong>Tipo:</strong> {ingresso.tipo}
                    </p>
                    <p className="mb-0 fw-bold">
                      <i className="bi bi-currency-dollar"></i>{" "}
                      <strong>Valor:</strong> R${" "}
                      {ingresso.valor.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
                <div className="card-footer bg-light">
                  <small className="text-primary">
                    ID do Ingresso: {ingresso.id}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
