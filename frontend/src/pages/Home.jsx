import Banner from '../components/Banner'
import CountryCards from '../components/CountryCards'

const Home = ({ onCountrySelect }) => {
  return (
    <div>
      <Banner />
      <CountryCards onCountrySelect={onCountrySelect} />
    </div>
  )
}

export default Home