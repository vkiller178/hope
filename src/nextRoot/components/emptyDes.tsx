import React from 'react'
const EmptyDes: React.FC<{ total: number }> = ({ total }) => {
  return total > 0 ? (
    <span>暂无数据，跳转第一页试试</span>
  ) : (
    <span>暂无数据</span>
  )
}
export default EmptyDes
