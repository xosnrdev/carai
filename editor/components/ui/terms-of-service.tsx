import type { FC } from 'react'

import { Button } from '@nextui-org/button'
import Link from 'next/link'

import Modal from './modal'
import { DialogDescription, DialogFooter } from './dialog'

interface TermsOfServiceProps {
    handleClose: () => void
}

const TermsOfService: FC<TermsOfServiceProps> = ({ handleClose }) => {
    return (
        <Modal
            aria-label="terms of service modal"
            title="Terms of Service"
            onOpenChange={handleClose}
        >
            <DialogDescription
                asChild
                className="max-h-[calc(100dvh-20dvh)] overflow-y-auto"
            >
                <main className="prose prose-sm dark:prose-invert">
                    <ol>
                        <li>
                            <h2>Acceptance of Terms</h2>
                            <p>
                                By using or contributing to this open-source
                                software (&quot;Software&quot;), you agree to be
                                bound by these Terms of Service
                                (&quot;Terms&quot;). If you do not agree to
                                these Terms, do not use or contribute to the
                                Software.
                            </p>
                        </li>
                        <li>
                            <h2>License</h2>
                            <p>
                                The Software is licensed under the{' '}
                                <Link
                                    href="https://github.com/xosnrdev/carai?tab=MIT-1-ov-file"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    MIT License{' '}
                                </Link>
                                You may use, modify, and distribute the Software
                                in accordance with the terms of the MIT License.
                            </p>
                        </li>
                        <li>
                            <h2>Contributions</h2>
                            <p>
                                Any contributions you make to the Software are
                                subject to the terms terms of the MIT License.
                                By contributing, you grant the Software&apos;s
                                maintainers the right to use, modify, and
                                distribute your contributions under the same
                                license.
                            </p>
                        </li>
                        <li>
                            <h2>Disclaimer of Warranties</h2>
                            <p>
                                The Software is provided &quot;as is,&quot;
                                without warranty of any kind, express or
                                implied, including but not limited to the
                                warranties of merchantability, fitness for a
                                particular purpose, and non-infringement. In no
                                event shall the authors or copyright holders be
                                liable for any claim, damages, or other
                                liability, whether in an action of contract,
                                tort, or otherwise, arising from, out of, or in
                                connection with the Software or the use or other
                                dealings in the Software.
                            </p>
                        </li>
                        <li>
                            <h2>Limitation of Liability</h2>
                            <p>
                                In no event will the authors or copyright
                                holders be liable for any special, incidental,
                                consequential, or indirect damages due to the
                                use or misuse of the Software, even if advised
                                of the possibility of such damages.
                            </p>
                        </li>
                        <li>
                            <h2>Governing Law</h2>
                            <p>
                                These Terms shall be governed by and construed
                                in accordance with the laws of Nigeria, without
                                regard to its conflict of law principles.
                            </p>
                        </li>
                        <li>
                            <h2>Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms at
                                any time. Changes will be effective immediately
                                upon posting. Your continued use of the Software
                                following the posting of changes constitutes
                                your acceptance of those changes.
                            </p>
                        </li>
                        <li>
                            <h2>Contact Information</h2>
                            <p>
                                If you have any questions about these Terms,
                                please contact us at{' '}
                                <Link href="mailto:contact@cexaengine.com">
                                    contact@cexaengine.com
                                </Link>
                            </p>
                        </li>
                    </ol>
                </main>
            </DialogDescription>
            <DialogFooter className="flex flex-row justify-between">
                <Button
                    color="warning"
                    size="lg"
                    startContent={<span>Decline</span>}
                    variant="flat"
                    onClick={(e) => {
                        e.preventDefault()
                        handleClose()
                    }}
                />
                <Button
                    color="success"
                    size="lg"
                    startContent={<span>Accept</span>}
                    variant="flat"
                    onClick={(e) => {
                        e.preventDefault()
                        handleClose()
                    }}
                />
            </DialogFooter>
        </Modal>
    )
}

export default TermsOfService
