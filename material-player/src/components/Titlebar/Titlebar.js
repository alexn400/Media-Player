import React, {useState} from 'react'
import {IconButton} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import MinimizeIcon from '@material-ui/icons/Minimize';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

export const styles = (theme) => ({
    root: {
        '-webkit-app-region': 'drag',
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        height: '32px',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '12px',
        background: theme.palette.background.default
    },
    titleBar: {
        justifySelf: 'left'
    },
    buttonBar: {
        '-webkit-app-region': 'none',
        justifySelf: 'right',
        display: 'flex'
    },
    button: {
        width: '33px',
        height: '33px'
    },
    titleLogo: {
        height: '24px',
        margin: '4px'
    }
})

const Titlebar = (props) => {
    const { classes, title } = props

    const [max, setMax] = useState(false)

    return (
        <div className={classes.root}>

            <div className={classes.titleBar}>
            <img alt={'logo'} src={'x32.png'} className={classes.titleLogo}/>
                {title}
            </div>
            <div className={classes.buttonBar}>
                <IconButton className={classes.button} aria-label="Exit" size={'small'} onClick={() => window.winAction.action('minimise')}>
                    <MinimizeIcon fontSize={'inherit'}/>
                </IconButton>
                <IconButton className={classes.button} aria-label="Exit" size={'small'} onClick={() => {window.winAction.action('toggleMaximise'); setMax(!max)}}>
                    {max? <FilterNoneIcon fontSize={'inherit'}/> : <CheckBoxOutlineBlankIcon fontSize={'inherit'}/>}
                </IconButton>
                <IconButton className={classes.button} aria-label="Exit" size={'small'} onClick={() => window.winAction.action('close')}>
                    <CloseIcon fontSize={'inherit'}/>
                </IconButton>
            </div>
        </div>
    )
}

export default withStyles(styles, { name: 'PLTitlebar' })(Titlebar);