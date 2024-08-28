import type { ICodeResponseProps } from '@/types'

import { Copy, CopyCheck } from 'lucide-react'
import { type FC } from 'react'
import toast from 'react-hot-toast'

import useCopyToClipboard from '@/hooks/useCopyToClipboard'
import useTabContext from '@/hooks/useTabContext'

const CodeResponse: FC<ICodeResponseProps> = ({
    flag,
    response,
    flagClassname,
    latency,
}) => {
    const { handleCopyToClipboard, isCopied } = useCopyToClipboard()
    const { codeResponse } = useTabContext()

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
            {codeResponse?.stdout && (
                <small className="float-right text-default-500">
                    {latency}ms
                </small>
            )}
            <pre className="whitespace-pre-wrap">
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

                {response}
            </pre>
        </div>
    )
}

export default CodeResponse
