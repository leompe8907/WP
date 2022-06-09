import '././widgetLg.scss'
import loginImage from '../../resources/imgs/login_image.jpg'

export const WidgetLg = () => {
  const Button = ({type})=>{
    return <button className={"widgetLgButton " + type}>{type}</button>
  }
  return (
    <div className='widgetLg'>
        <h3 className="widgetLgTitle">Latest suscriptions</h3>
        <table className="widgetLgTable">
          <tbody> 
            <tr className="widgetLgTr">
              <th className="widgetLgTh">Cliente</th>
              <th className="widgetLgTh">Fecha</th>
              <th className="widgetLgTh">Monto</th>
              <th className="widgetLgTh">Estado</th>
            </tr>
            <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img src={loginImage} alt="" className="widgetLgimg" />
                <span className="widgetLgName">Leo Messi</span>
              </td>
              <td className="widgetLgDate">2 jun 2022</td>
              <td className="widgetLgMonto">USD 10</td>
              <td className="widgetLgStatus"><Button type="Rechazado"/></td>
            </tr>
          </tbody>
        </table>
    </div>

  )
}
