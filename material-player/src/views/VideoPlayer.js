import React, { useState, useEffect, useRef } from 'react'
import { Menu, MenuItem, ListItemIcon, Snackbar, Grow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Video from '../components/Video/Video';
import Controls from '../components/Controls/Controls';
import KeyListener from 'react-key-listener'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VideoFallback from '../VideoFallBack/VideoFallback';

const VIDEO = [
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'D:/8a.mp4'
]

let snackbar;

export const styles = (theme) => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        position: 'relative',
        '&:focus ': {
            outline: 'none'
        }
    }
})

const initialDialogState = {
    mouseX: null,
    mouseY: null,
};

const getTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60)
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
}

const VideoPlayer = (props) => {
    const { classes, fullscreen, setFullscreen, setTitle, player } = props
    const focus = useRef(null)
    const [src, setSrc] = useState(VIDEO[0])
    const [time, setTime] = useState(0)
    const [changeTime, setChangeTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [play, setPlay] = useState();
    const [volume, setVolume] = useState(0.5)
    const [speed, setSpeed] = useState(1)
    const [mute, setMute] = useState(false)
    const [dialog, setDialog] = useState(initialDialogState)
    const [notif, setNotif] = useState(false)
    const [notifMsg, setNotifMsg] = useState('')
    const [incTime, setIncTime] = useState(0)

    useEffect(() => {
        window.loader.getFile().then((result) => {
            console.log(result);
            if (result.length > 0) {
                setSrc(result[0])
                setPlay(true)
            }

        }).catch((err) => {
            console.log(err);
        });
    }, [setTitle])

    useEffect(() => {
        window.loader.getUserFile().then(({filePaths}) => {
            console.log(filePaths);
            if (filePaths.length > 0) {
                setSrc(filePaths[0])
                setPlay(true)
            }

        }).catch((err) => {
            console.log(err);
        });
    }, [])


    const handlePress = (e) => {
        e.stopPropagation()
        const { keyCode } = e
        switch (keyCode) {
            //esc - exit fullscreen
            case 27:
                setFullscreen(false);
                break;
            //f - enter fullscreen
            case 70:
                setFullscreen(!fullscreen);
                break;
            //Spacebar
            case 32:
                setPlay(!play);
                break;
            //Right arrow
            case 39:
                setChangeTime(time + 5);
                setIncTime(incTime + 5)
                break;
            //Left arrow
            case 37:
                setChangeTime(time - 5);
                setIncTime(incTime - 5)
                break;
            //Right arrow bracket
            case 190:
                if (speed < 10) {
                    setSpeed(speed + 0.25);
                }
                break;
            //Left arrow bracket
            case 188:
                if (speed > 0.5) {
                    setSpeed(speed - 0.25);
                }
                break;
            //up arrow
            case 38:
                if (volume < 0.9) {
                    setVolume(+(volume + 0.1).toFixed(2));  
                }
                break;
            //down arrow
            case 40:
                if (volume > 0.1) {
                    setVolume(+(volume - 0.1, 1).toFixed(2));
                }
                break;
            default:
                break
        }

    }

    useEffect(()=>{
        notify(`Speed: ${speed}x`)
    },[speed])

    useEffect(()=>{
        notify(`Volume: ${Math.round(volume*100)}%`)
    },[volume])

    useEffect(()=>{
        if(incTime !== 0){
            setNotifMsg(`(${incTime > 0? '+':''}${incTime}s) ${getTime(time + 5)}/${getTime(duration)}`)
            clearTimeout(snackbar)
            setNotif(true)
            snackbar = setTimeout(()=>{setNotif(false); setIncTime(0)}, 1000)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[incTime])

    useEffect(() => {
        const videoTitle = src.split(/[\\/]/).pop()
        setTitle(videoTitle)
        document.title =videoTitle
        focus.current.focus()
        notify(`Now Playing: ${videoTitle}`)
    }, [setTitle, src]);

    const handleDialogClick = (event) => {
        event.preventDefault();
        if(src!==''){
            setDialog({
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
            });
        }

    };

    const handleDialogClose = () => {
        setDialog(initialDialogState);
    };

    const notify = (msg) => {
        setNotifMsg(msg)
        clearTimeout(snackbar)
        setNotif(true)
        snackbar = setTimeout(()=>setNotif(false), 1000)
    }

    return (
        <div className={classes.root} tabIndex={0} onKeyDown={handlePress} autoFocus ref={focus} onContextMenu={handleDialogClick}>
            {src!==''? <Video
            player={player}
                src={src}
                speed={speed}
                time={time}
                play={play}
                changeTime={changeTime}
                setChangeTime={setChangeTime}
                setTime={setTime}
                setDuration={setDuration}
                fullscreen={fullscreen}
                volume={volume}
                mute={mute}
            /> : <VideoFallback/>}
            <Controls
                time={time}
                duration={duration}
                setTime={setChangeTime}
                play={play}
                setPlay={setPlay}
                fullscreen={fullscreen}
                setFullscreen={setFullscreen}
                volume={volume}
                setVolume={setVolume}
                mute={mute}
                setMute={setMute}
                disabled={src === '' ? true : false}
            />
            <Menu
                keepMounted
                open={dialog.mouseY !== null}
                onClose={handleDialogClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    dialog.mouseY !== null && dialog.mouseX !== null
                        ? { top: dialog.mouseY, left: dialog.mouseX }
                        : undefined
                }
            >
                <MenuItem onClick={() => { handleDialogClose(); setPlay(!play) }}>
                    <ListItemIcon>
                        {play ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                    </ListItemIcon>
                    {play ? 'Pause' : 'Play'}
                </MenuItem>
                <MenuItem onClick={() => {handleDialogClose(); setVolume(volume + 0.1)}}>
                    <ListItemIcon>
                        <VolumeUpIcon fontSize="small" />
                    </ListItemIcon>
                    Volume up
                </MenuItem>
                <MenuItem onClick={() => {handleDialogClose(); setVolume(volume - 0.1)}}>
                    <ListItemIcon>
                        <VolumeDownIcon fontSize="small" />
                    </ListItemIcon>
                    Volume down
                </MenuItem>
                <MenuItem onClick={() => {handleDialogClose(); setSpeed(speed + 0.25)}}>
                    <ListItemIcon>
                        <FastForwardIcon fontSize="small" />
                    </ListItemIcon>
                    Speed up
                </MenuItem>
                <MenuItem onClick={() => {handleDialogClose(); setSpeed(speed - 0.25)}}>
                    <ListItemIcon>
                        <FastRewindIcon fontSize="small" />
                    </ListItemIcon>
                    Slow down
                </MenuItem>
            </Menu>
            <Snackbar
            anchorOrigin={{horizontal:'right', vertical:'top'}}
            open={notif}
            TransitionComponent={Grow}
            message={notifMsg}
            disableWindowBlurListener
            />
        </div>

    )
}

export default withStyles(styles, { name: 'PLVideoPlayer' })(VideoPlayer);
