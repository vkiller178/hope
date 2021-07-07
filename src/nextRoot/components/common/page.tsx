import classNames from 'classnames'
import styles from './page.module.scss'
export const PageContent: React.FC<{ className?: any }> = ({
  children,
  className,
}) => {
  return (
    <div className={classNames(styles.pageContent, className)}>{children}</div>
  )
}
