
type IncidentsProps = {
  isReporter: boolean;
};

function Incidents ({ isReporter }: IncidentsProps) {
  console.log("isReporter:", isReporter);
  return (
    isReporter ? 
    <h1>ACCESS DENIED</h1>
    :
    <h1>Incidents Page</h1> 
  )
}

export default Incidents;