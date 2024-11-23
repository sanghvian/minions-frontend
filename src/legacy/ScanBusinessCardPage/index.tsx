
import './ScanBusinessCardPage.css'
import { useEffect } from 'react'
import { pushEvent } from '@utils/analytics'
import ScanCard from '../ScanCard'

const ScanCardPage = () => {
    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'ScanCardPage' })
    })
    return (
        <div className='scan-card-page'>
            <h4>Take or upload a picture of a business card to save the contact</h4>
            <ScanCard />
        </div>
    )
}

export default ScanCardPage
