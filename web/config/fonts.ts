import { Mukta } from 'next/font/google'

const mukta = Mukta({
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    display: 'swap',
    subsets: ['latin'],
    preload: true,
    variable: '--font-mukta',
})

export default mukta
