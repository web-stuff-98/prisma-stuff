import classes from './ProgressBar.module.css'

export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className={classes.progressBar}>
      <div style={{ width: `${percent}%` }} className={classes.progress} />
    </div>
  )
}
