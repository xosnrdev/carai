import { XTerm, XTermProps } from 'react-xtermjs'

export default function Terminal({ className }: XTermProps) {
    return <XTerm className={className} />
}
