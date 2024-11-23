import { pushEvent } from '@utils/analytics';
import { Button } from 'antd';
import { useEffect } from 'react';
import YouTube from 'react-youtube';

const NewLanderPage = () => {
    useEffect(() => {
        pushEvent('UserPageView', { pageName: 'GroupsListPage' });
    })

    return (
        <div style={{
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            overflowX: 'hidden',
            display: 'flex',
            padding: '2rem',
            gap: '0.5rem',
            textAlign: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            background: '#000',
            color: '#fff'
        }}>
            <h3>🤫 We are still in beta access only. If you see some value, just book a call with us - always happy to show you around</h3>


            {/* A simple a with the href set to mailto with subject as "Give me access to recontact" and target email address as ankit@recontact.world */}
            <Button href={'https://calendly.com/recontact'} >Book Demo</Button>






            {/* <Button href={'https://forms.gle/cPe9x2RA5DFPKviv9'} >
                Sign up for waitlist
            </Button>
            <YouTube
                videoId={'K1moSPz2vCw'}                  // defaults -> ''
            // id={string}                       // defaults -> ''
            // className={string}                // defaults -> ''
            // iframeClassName={string}          // defaults -> ''
            // style={object}                    // defaults -> {}
            // title={string}                    // defaults -> ''
            // loading={string}                  // defaults -> undefined
            // opts={obj}                        // defaults -> {}
            // onReady={func}                    // defaults -> noop
            // onPlay={func}                     // defaults -> noop
            // onPause={func}                    // defaults -> noop
            // onEnd={func}                      // defaults -> noop
            // onError={func}                    // defaults -> noop
            // onStateChange={func}              // defaults -> noop
            // onPlaybackRateChange={func}       // defaults -> noop
            // onPlaybackQualityChange={func}    // defaults -> noop
            /> */}

        </div>
    )
}

export default NewLanderPage
