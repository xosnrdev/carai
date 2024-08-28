import localFont from 'next/font/local'

const nohemi = localFont({
    src: [
        {
            path: '../public/assets/fonts/nohemi-thin.woff',
            weight: '100',
            style: 'thin',
        },
        {
            path: '../public/assets/fonts/nohemi-extralight.woff',
            weight: '200',
            style: 'extralight',
        },
        {
            path: '../public/assets/fonts/nohemi-light.woff',
            weight: '300',
            style: 'light',
        },
        {
            path: '../public/assets/fonts/nohemi-regular.woff',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../public/assets/fonts/nohemi-medium.woff',
            weight: '500',
            style: 'medium',
        },
        {
            path: '../public/assets/fonts/nohemi-semibold.woff',
            weight: '600',
            style: 'semibold',
        },
        {
            path: '../public/assets/fonts/nohemi-bold.woff',
            weight: '700',
            style: 'bold',
        },
        {
            path: '../public/assets/fonts/nohemi-extrabold.woff',
            weight: '800',
            style: 'extrabold',
        },
        {
            path: '../public/assets/fonts/nohemi-black.woff',
            weight: '900',
            style: 'black',
        },
    ],

    variable: '--font-nohemi',
})

export default nohemi
