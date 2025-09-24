const Policy = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-6">
        <h1>Privacy Policy</h1>

        <p>
          Questo sito funge esclusivamente da{" "}
          <strong>interfaccia di accesso</strong> a{" "}
          <a
            href="https://rpggek.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            RPGGEEK
          </a>
          , un popolare database e community per giochi di ruolo. <br />
          Non ospita né gestisce direttamente alcun dato personale degli utenti.
          <br />
          Non vengono raccolti, memorizzati né elaborati dati personali degli
          utenti.
        </p>

        <h2>Dati raccolti</h2>
        <ul>
          <li>
            <strong>Nessun dato personale</strong> viene raccolto direttamente
            da questo sito.
          </li>
          <li>
            Non vengono utilizzati <strong>cookie di profilazione</strong> o
            strumenti di tracciamento.
          </li>
          <li>
            Non viene effettuato alcun monitoraggio statistico o analitico degli
            utenti.
          </li>
        </ul>

        <h2>Collegamenti a siti esterni</h2>
        <p>
          Poiché questo sito è un’interfaccia verso un servizio esterno,
          eventuali dati forniti o raccolti sono gestiti direttamente dal sito
          di destinazione. Invitiamo pertanto a consultare la
          <strong>Privacy Policy</strong> del sito di riferimento per conoscere
          come vengono trattati i dati in quel contesto.
        </p>

        <h2>Titolare del trattamento</h2>
        <p>
          Poiché questo sito non effettua trattamenti di dati personali, non è
          previsto un titolare del trattamento ai sensi del GDPR. Per ogni
          informazione relativa ai dati eventualmente trattati dal sito di
          destinazione, si rimanda al titolare di quel servizio.
        </p>

        <h2>Aggiornamenti</h2>
        <p>
          La presente informativa può essere aggiornata in caso di modifiche al
          funzionamento del sito. In tal caso, la nuova versione sarà pubblicata
          in questa stessa pagina.
        </p>
      </main>
    </div>
  );
};

export default Policy;
