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
      <LoadingOutlined /> 正在保存草稿
    </span>
  ),
  [SavingStatus.success]: <span>保存成功</span>,
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
      {labels[status]}
      <SubmitButton disabled={status !== SavingStatus.miss} onClick={onSubmit}>
        提交
      </SubmitButton>
    </>
  )
}

export default TitleArea
