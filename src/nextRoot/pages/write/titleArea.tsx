import { Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styled from 'styled-components'

export enum SavingStatus {
  saving,
  success,
  miss,
}

const labels = {
  [SavingStatus.saving]: (
    <span>
      <LoadingOutlined /> 本地缓存
    </span>
  ),
  [SavingStatus.success]: <span>缓存成功</span>,
  [SavingStatus.miss]: null,
}

const SubmitButton = styled(Button)`
  margin-left: 8px;
`

const TitleArea: React.FunctionComponent<{
  status: SavingStatus
  onSubmit: () => void
}> = ({ status, onSubmit }) => {
  return (
    <>
      <SubmitButton disabled={status !== SavingStatus.miss} onClick={onSubmit}>
        {labels[status] || '确认提交'}
      </SubmitButton>
    </>
  )
}

export default TitleArea
