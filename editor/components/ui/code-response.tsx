import type { ICodeResponseProps } from '@/types'

import { Copy, CopyCheck } from 'lucide-react'
import { type FC } from 'react'
import toast from 'react-hot-toast'

import useCopyToClipboard from '@/hooks/useCopyToClipboard'

const CodeResponse: FC<ICodeResponseProps> = ({
    flag,
    response,
    flagClassname,
}) => {
    const { handleCopyToClipboard, isCopied } = useCopyToClipboard()

    const handleCopy = async () => {
        const copyResponse = await handleCopyToClipboard(response)

        const { success, error } = copyResponse

        if (success) {
            toast.success('Copied to clipboard')
        }

        if (error) {
            toast.error(error.message)
        }
    }

    const CopyIcon = isCopied ? CopyCheck : Copy

    return (
        <div className="mb-2">
            <span className={`font-bold ${flagClassname}`}>{flag}</span>
            <button
                aria-label={isCopied ? 'Copied' : 'Copy to clipboard'}
                className="float-right"
                onClick={(e) => {
                    e.preventDefault()
                    handleCopy()
                }}
            >
                <CopyIcon />
            </button>
            <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
    )
}

export default CodeResponse
