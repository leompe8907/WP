import { KeyboardArrowDownSharp, KeyboardArrowUpSharp } from '@material-ui/icons'
import './featuredinfo.scss'

export const Featuredinfo = () => {
  return (
    <div className="featured">
        <div className="featuredItem">
            <span className="featuredTitle">Revenue</span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney">$55.3</span>
                <span className="featuredMoneyRate">
                    -35%
                    <KeyboardArrowDownSharp  className='featuredIcon negative'/>
                </span>
            </div>
            <span className="featuredSub">Comparado al mes pasado</span>
        </div>
        <div className="featuredItem">
            <span className="featuredTitle">Sales</span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney">$5.3</span>
                <span className="featuredMoneyRate">
                    -33%
                    <KeyboardArrowDownSharp className='featuredIcon negative'/>
                </span>
            </div>
            <span className="featuredSub">Comparado al mes pasado</span>
        </div>
        <div className="featuredItem">
            <span className="featuredTitle">Cost</span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney">$100.3</span>
                <span className="featuredMoneyRate">
                    +45%
                    <KeyboardArrowUpSharp className='featuredIcon'/>
                </span>
            </div>
            <span className="featuredSub">Comparado al mes pasado</span>
        </div>
    </div>
  )
}
