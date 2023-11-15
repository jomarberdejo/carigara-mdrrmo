import React, { lazy, Suspense } from 'react';
import PageIntro from '../components/pageIntro/PageIntro'
import Cards from '../components/card/Cards'
import Charts from '../components/charts/Charts'
import ExportUserTable from '../components/table/ExportUserTable'
import ExportIncidentTable from '../components/table/ExportIncidentTable'

const Dashboard = () => {
  return (
    <>
      <main>
          <PageIntro />
          
          <section>
          <div className="w-full my-8">
           
           <Cards />
     
            
          </div>
           
            <div className="w-full my-8">
           
              <Charts />
       
              
            </div>
            <div className=" w-full my-8">
              <ExportUserTable />
            </div>
            <div className="w-full my-8">
              <ExportIncidentTable />
            </div>
            
          </section>
      </main>
    </>
  );
};

export default Dashboard;
