
import IncidentsPageTable from '../components/table/IncidentsPageTable'
import PageIntro from '../components/pageIntro/PageIntro'

const Incidents = () => {
  return (
    <>
      <section className="w-full">
          <PageIntro />
          <IncidentsPageTable />
      </section>
    </>
  );
};

export default Incidents;
