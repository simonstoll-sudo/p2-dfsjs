import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate, Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

// Anti-pattern 1: Données hardcodées directement dans le composant (au lieu d'un hook ou fichier séparé)
const olympicsData: any = [
  {
    id: 1,
    country: 'États-Unis',
    participations: [
      { id: 1, year: 2020, city: 'Tokyo', medalsCount: 113, athleteCount: 613 },
      { id: 2, year: 2016, city: 'Rio', medalsCount: 121, athleteCount: 555 },
      { id: 3, year: 2012, city: 'Londres', medalsCount: 104, athleteCount: 530 },
      { id: 4, year: 2008, city: 'Pékin', medalsCount: 112, athleteCount: 596 },
      { id: 5, year: 2004, city: 'Athènes', medalsCount: 101, athleteCount: 533 }
    ]
  },
  {
    id: 2,
    country: 'Chine',
    participations: [
      { id: 6, year: 2020, city: 'Tokyo', medalsCount: 88, athleteCount: 431 },
      { id: 7, year: 2016, city: 'Rio', medalsCount: 70, athleteCount: 413 },
      { id: 8, year: 2012, city: 'Londres', medalsCount: 88, athleteCount: 396 },
      { id: 9, year: 2008, city: 'Pékin', medalsCount: 100, athleteCount: 639 },
      { id: 10, year: 2004, city: 'Athènes', medalsCount: 63, athleteCount: 407 }
    ]
  },
  {
    id: 3,
    country: 'Japon',
    participations: [
      { id: 11, year: 2020, city: 'Tokyo', medalsCount: 58, athleteCount: 582 },
      { id: 12, year: 2016, city: 'Rio', medalsCount: 41, athleteCount: 338 },
      { id: 13, year: 2012, city: 'Londres', medalsCount: 38, athleteCount: 293 },
      { id: 14, year: 2008, city: 'Pékin', medalsCount: 25, athleteCount: 351 },
      { id: 15, year: 2004, city: 'Athènes', medalsCount: 37, athleteCount: 312 }
    ]
  },
  {
    id: 4,
    country: 'Grande-Bretagne',
    participations: [
      { id: 16, year: 2020, city: 'Tokyo', medalsCount: 65, athleteCount: 376 },
      { id: 17, year: 2016, city: 'Rio', medalsCount: 67, athleteCount: 366 },
      { id: 18, year: 2012, city: 'Londres', medalsCount: 65, athleteCount: 541 },
      { id: 19, year: 2008, city: 'Pékin', medalsCount: 51, athleteCount: 312 },
      { id: 20, year: 2004, city: 'Athènes', medalsCount: 30, athleteCount: 264 }
    ]
  },
  {
    id: 5,
    country: 'France',
    participations: [
      { id: 21, year: 2020, city: 'Tokyo', medalsCount: 33, athleteCount: 378 },
      { id: 22, year: 2016, city: 'Rio', medalsCount: 42, athleteCount: 401 },
      { id: 23, year: 2012, city: 'Londres', medalsCount: 34, athleteCount: 330 },
      { id: 24, year: 2008, city: 'Pékin', medalsCount: 41, athleteCount: 323 },
      { id: 25, year: 2004, city: 'Athènes', medalsCount: 33, athleteCount: 308 }
    ]
  }
]

// Anti-pattern 2: Composant gigantesque qui fait tout (Home page + Detail page dans un seul fichier)
function Home() {
  const [data, setData] = useState<any>(null) // Anti-pattern 3: utilisation de `any`
  const navigate = useNavigate()

  // Anti-pattern 4: useEffect mal géré, sans dépendances claires
  useEffect(() => {
    console.log('Loading data...') // Anti-pattern 5: console.log laissé dans le code
    // Simulation d'un appel API dans le composant (au lieu d'un hook)
    setTimeout(() => {
      setData(olympicsData)
      console.log('Data loaded:', olympicsData) // Anti-pattern 5: console.log
    }, 500)
  }, [])

  // Anti-pattern 6: Logique métier complexe directement dans le composant
  const calculateTotalMedals = (country: any) => {
    return country.participations.reduce((sum: any, p: any) => sum + p.medalsCount, 0)
  }

  const totalParticipatingCountries = data ? data.length : 0
  const totalGamesEditions = 5

  if (!data) {
    return <div className="text-white">Chargement...</div>
  }

  // Anti-pattern 7: Préparation des données pour le graphique directement dans le composant
  const chartData = {
    labels: data.map((d: any) => d.country),
    datasets: [
      {
        label: 'Total des médailles',
        data: data.map((d: any) => calculateTotalMedals(d)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const country = data[index]
        console.log('Navigating to country:', country) // Anti-pattern 5: console.log
        navigate(`/country/${country.id}`)
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: 'Total des médailles par pays',
        color: 'white'
      },
    },
  }

  // Anti-pattern 8: JSX volumineux avec beaucoup de logique inline
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Historique des Jeux Olympiques - TéléSport</h1>

        <div className="mb-8 text-center">
          <p className="text-lg mb-4">
            Bienvenue sur la page dédiée à l'historique des Jeux Olympiques.
            Explorez les performances des pays au fil des années.
          </p>
        </div>

        {/* Anti-pattern 9: Composant inline qui devrait être extrait */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Pays participants</h3>
            <p className="text-4xl font-bold text-blue-400">{totalParticipatingCountries}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Éditions des JO</h3>
            <p className="text-4xl font-bold text-green-400">{totalGamesEditions}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div style={{ height: '400px' }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Anti-pattern 10: Code dupliqué - cette instruction pourrait être un composant */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Cliquez sur un pays pour voir ses détails</p>
        </div>
      </div>
    </div>
  )
}

// Anti-pattern 11: Encore un énorme composant dans le même fichier
function CountryDetail() {
  const { id } = useParams()
  const [country, setCountry] = useState<any>(null) // Anti-pattern 3: any
  const navigate = useNavigate()

  // Anti-pattern 4: useEffect mal structuré, logique complexe dans le composant
  useEffect(() => {
    console.log('Loading country with id:', id) // Anti-pattern 5: console.log
    const foundCountry = olympicsData.find((c: any) => c.id === Number(id))

    if (!foundCountry) {
      console.log('Country not found!') // Anti-pattern 5: console.log
      navigate('/404')
      return
    }

    setCountry(foundCountry)
    console.log('Country loaded:', foundCountry) // Anti-pattern 5: console.log
  }, [id, navigate])

  if (!country) {
    return <div className="text-white">Chargement...</div>
  }

  // Anti-pattern 6: Calculs métier dans le composant
  const totalMedals = country.participations.reduce((sum: any, p: any) => sum + p.medalsCount, 0)
  const totalAthletes = country.participations.reduce((sum: any, p: any) => sum + p.athleteCount, 0)
  const totalParticipations = country.participations.length

  // Anti-pattern 7: Préparation complexe des données de graphique dans le composant
  const evolutionData = {
    labels: country.participations.map((p: any) => p.year.toString()),
    datasets: [
      {
        label: 'Nombre de médailles',
        data: country.participations.map((p: any) => p.medalsCount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3,
      },
    ],
  }

  const evolutionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'white'
        }
      },
      title: {
        display: true,
        text: `Évolution des médailles - ${country.country}`,
        color: 'white'
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  }

  // Anti-pattern 8: JSX énorme
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            ← Retour au dashboard
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center">{country.country}</h1>

        {/* Anti-pattern 9: Code dupliqué avec Home (ces cartes devraient être un composant) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Participations</h3>
            <p className="text-4xl font-bold text-blue-400">{totalParticipations}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total médailles</h3>
            <p className="text-4xl font-bold text-yellow-400">{totalMedals}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Total athlètes</h3>
            <p className="text-4xl font-bold text-green-400">{totalAthletes}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div style={{ height: '400px' }}>
            <Line data={evolutionData} options={evolutionOptions} />
          </div>
        </div>

        {/* Anti-pattern 10: Encore du code dupliqué */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Données des 5 dernières éditions des Jeux Olympiques</p>
        </div>
      </div>
    </div>
  )
}

// Anti-pattern 12: Page 404 basique dans le même fichier
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page non trouvée</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

// Anti-pattern 13: Tout le routing dans App.tsx au lieu d'une structure séparée
function App() {
  console.log('App rendered') // Anti-pattern 5: console.log

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:id" element={<CountryDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
