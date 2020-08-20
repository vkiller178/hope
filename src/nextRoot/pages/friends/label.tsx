import React from 'react'
import styled from 'styled-components'

const LabelContent = styled('div')`
  position: absolute;
  right: -30px;
  top: 0;
  transform: rotateZ(45deg);

  .recommend-container {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 30px 30px 30px;
    border-color: transparent transparent #20c05c transparent;
  }
  span {
    position: absolute;
    top: 13px;
    right: 13px;
    display: inline-block;
    width: 30px;
    color: #fff;
  }
`

const Label = () => {
  return (
    <LabelContent>
      <i className="recommend-container"></i>
      <span>打印</span>
    </LabelContent>
  )
}

export default Label
