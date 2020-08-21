import React from 'react'
import { LoadState } from './Scroll'
import styled from 'styled-components'

const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
  padding: 20px 0;
`

const Indicator: React.FC<{ load: LoadState }> = ({ load }) => {
  return (
    <Wrapper>
      {load === LoadState.loading ? (
        <>
          <span>加载中</span>
        </>
      ) : load === LoadState.noMore ? (
        <span>暂无更多</span>
      ) : null}
    </Wrapper>
  )
}

export default Indicator
