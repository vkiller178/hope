import React, { useEffect, useRef, useState, CSSProperties } from 'react'
import { makeStyles, Fab, Snackbar, IconButton, Grid } from '@material-ui/core'
import {
  MoreHoriz,
  Close as CloseIcon,
  Fullscreen,
  FullscreenExit,
} from '@material-ui/icons'
import InputArea from './InputArea'
import PreviewArea from './PreviewArea'
import clsx from 'clsx'
import Tools, { ToolMap } from './tool'

// 分钟
const autoSaveTime = 0.2

const useEditorStyle = makeStyles((theme) => ({
  ActionButton: {
    position: 'fixed',
    right: 30,
    bottom: 30,
  },
  editorRoot: {
    height: '100%',
    width: '100%',
    paddingBottom: 30,
    '& .inputArea,.previewArea': {
      width: '50%',
      position: 'relative',
      zIndex: 0,
    },
    '& .previewArea': {
      borderLeft: '1px solid #ccc',
      zIndex: -1,
    },
    '& .tools': {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#007acc',
    },
  },
}))

export const NewEditor: React.FC<
  {
    value: string
    onSave?: (val: string, saveCallback: () => void) => void
    onMore?: () => void
  } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const classes = useEditorStyle()
  const timerRef = useRef<any>()
  const saveCallback = useRef<any>()
  const [content, setContent] = useState(props.value)
  const [setting, setSetting] = useState<{ expend: boolean }>({ expend: false })

  const [snackbar, setSnackbar] = useState<{ open: boolean; content?: any }>({
    open: false,
  })

  const tools: ToolMap = {
    expend: {
      icon: () => {
        return setting.expend ? (
          <FullscreenExit
            onClick={() => {
              setSetting((_) => ({ ..._, expend: !setting.expend }))
            }}
          />
        ) : (
          <Fullscreen
            onClick={() => {
              setSetting((_) => ({ ..._, expend: !setting.expend }))
            }}
          />
        )
      },
    },
  }

  saveCallback.current = () => {
    _onSave()
  }

  function _onSave() {
    function saveCallback(content: string = '') {
      setSnackbar((_) => ({ ..._, content }))

      setTimeout(() => {
        setSnackbar((_) => ({ ..._, open: false }))
      }, 300)
    }
    if (content !== props.value && props.onSave) {
      setSnackbar((_) => ({ content: '正在保存', open: true }))
      props.onSave(content, saveCallback)
    }
  }

  useEffect(() => {
    //先比较再赋值
    if (content !== props.value) setContent(props.value)
  }, [props.value])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      saveCallback.current && saveCallback.current()
    }, autoSaveTime * 60 * 1000)

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return (
    <Grid
      container
      direction="row"
      justify="center"
      className={clsx(classes.editorRoot, props.className)}
    >
      <InputArea
        className="inputArea"
        initValue={content}
        onEdit={(v) => setContent(v)}
      />

      {setting.expend && (
        <PreviewArea content={content} className="previewArea markdown-body" />
      )}

      <Tools className="tools" tools={tools} />

      <Fab
        onClick={() => props.onMore && props.onMore()}
        size="small"
        color="primary"
        className={classes.ActionButton}
      >
        <MoreHoriz />
      </Fab>
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        message={snackbar.content}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="secondary"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Grid>
  )
}
