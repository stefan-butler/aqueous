import { fetchGlobalIncidents } from "../redux/slices/incidentSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";

function Incidents () {
//I have focused entirely on the functionality for the moment
  const dispatch = useDispatch<AppDispatch>();
  const global = useSelector((state: RootState) => state.incident.global)

  useEffect(() => {
    dispatch(fetchGlobalIncidents())
  },[])

  console.log(global)
  return (
    (global.list.map((incident) => {
      return <h1>{incident.title}</h1>
    }))
  )
}

export default Incidents;