import './globals.css'

export const metadata = {
  title: 'CrewLove — Roster Calendar',
  description: 'JFK Crew Roster Shared Calendar',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
