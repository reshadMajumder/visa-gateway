import Banner from '../components/Banner'
import CountryCards from '../components/CountryCards'

const Home = () => {
  return (
    <div>
      <Banner />
      <section className="countries-section section" id="countries">
        <div className="container">
          <h2 className="section-title">Ousr Services</h2>

          <CountryCards />
        </div>
      </section>
    </div>
  )
}

export default Home