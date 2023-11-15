import PageIntro from '../components/pageIntro/PageIntro'
import UsersPageTable from '../components/table/UsersPageTable'

const Users = () => {
  return (
    <>
      <section className="md:w-full bg-bkg text-content">

          <PageIntro />
          <UsersPageTable />
      </section>
    </>
  );
};

export default Users;
