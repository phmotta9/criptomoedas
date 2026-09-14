import { useState, useEffect } from 'react'
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom' 

const API_KEY = import.meta.env.VITE_API_KEY;

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProps {
  data: CoinProps[];
}

function Home() {
  const [input, setInput] = useState("")
  const [coins, setCoins] = useState<CoinProps[]>([])
  const [offset, setOffset] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    getData();
  }, [offset])

  async function getData() {
    fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=${API_KEY}`)
    .then(response => response.json())
    .then((data: DataProps) => {
      const coinsData = data.data;

      const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      })

      const priceCompact = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        style: 'currency',
        currency: 'USD',
      })

      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
        }
        return formated;
    })
      const listCoins = [...coins, ...formatedResult]
      setCoins(listCoins)
  })

}

  function handleSubmit(e: any) {
    e.preventDefault()

    if(input === "") return;
    navigate(`detail/${input}`)
  
  };

  function handleGetMore() {
    setOffset(prev => prev + 10)
  }
  
  return (
      <main className={styles.main}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder='Digite o nome da moeda... Ex bitcoin'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            />
            <button type='submit'>
              <BsSearch size={30} color="#fff" /> 
            </button>
        </form>

        <table>
          <thead>
            <tr>
              <th scope='col'>Moeda</th>
              <th scope='col'>Valor Mercado</th>
              <th scope='col'>Preço</th>
              <th scope='col'>Volume</th>
              <th scope='col'>Variação 24h</th>
            </tr>
          </thead>

          <tbody id='tbody'>
            {coins.length > 0 && coins.map((item) => (
              <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label='Moeda'>
                <div className={styles.name}>
                  <img 
                  className={styles.logo}
                  src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} 
                  alt="logo cripto" />
                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>
              <td className={styles.tdLabel} data-label='Valor Mercado'>
                {item.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label='Preço'>
                {item.formatedPrice}
              </td>
              <td className={styles.tdLabel} data-label='Volume'>
                {item.formatedVolume}
              </td>
              <td className={Number(item.changePercent24Hr) >= 0 ? styles.tdProfit : styles.tdLoss}
               data-label='Variação 24h'>
                <span>{Number(item.changePercent24Hr).toFixed(3)}%</span>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
        
        <button className={styles.buttonMore} onClick={handleGetMore}>
          Carregar mais
        </button>

      </main>

  )
}

export default Home