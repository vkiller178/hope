import React, { Props } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core'

interface Tool {
  icon: string | React.ComponentType
  handler?: any
}
export interface ToolMap {
  [key: string]: Tool
}
interface ToolsProps {
  tools: ToolMap
}

const useToolsStyle = makeStyles((theme) => ({
  toolsRoot: {
    backgroundColor: 'gray',
  },
}))
const Tools: React.FC<ToolsProps & React.HTMLAttributes<HTMLDivElement>> = (
  props
) => {
  const classes = useToolsStyle()
  const tools = Object.keys(props.tools)

  function renderTool(tool: Tool) {
    //@ts-ignore
    return <tool.icon />
  }
  return (
    <div className={clsx(props.className, classes.toolsRoot)}>
      {tools.map((t: keyof ToolMap) => renderTool(props.tools[t]))}
    </div>
  )
}
export default Tools
