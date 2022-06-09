import { Chart } from '../../components/chart/Chart';
import { Featuredinfo } from '../../components/featuredInfo/Featuredinfo';
import './home.scss';
import { userData } from "../../dataAuxiliar";
import { WidgetLg } from '../../components/WidgetLg/WidgetLg';
import { WidgetSm } from '../../components/widgetSm/WidgetSm';
import { useContext, useEffect, useMemo, useState } from "react";
import axios from 'axios'
export const Home = () => {
  

  const MONTHS = useMemo(
    ()=>[
      "Jan", 
      "Feb", 
      "Mar", 
      "Apr", 
      "May", 
      "Jun", 
      "Jul", 
      "Aug", 
      "Sep", 
      "Oct", 
      "Nov", 
      "Dec"], 
      []
  ); 

  const [userStats, setUsreStats] = useState([])
  useEffect(()=>{
    
    const getStats = async ()=>{
      try{

        const res = await axios.get("/user/stats",{
          headers: {token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken},
        });
        const statsList = res.data.sort((a,b)=>{
          return a._id - b._id;
        });
        statsList.map((item) => setUsreStats((prev)=>[
          ...prev, 
          { name : MONTHS[item._id - 1], "New User": item.total }
        ]));
      }catch(err){
        console.log(err);
      }
    }
    getStats();
  },[MONTHS]);
  return (
    <div className="home">
        <Featuredinfo/>
        <Chart data={userStats} title = "User Analitycs" grid dataKey="New User"/>
        <div className="homeWidgets">
          <WidgetSm/>
          <WidgetLg/>
        </div>
    </div>
  )
}
