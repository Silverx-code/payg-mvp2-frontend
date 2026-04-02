import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, back = true, right }) {
  const navigate = useNavigate()
  return (
    <div className="bg-white px-5 lg:px-8 pt-10 lg:pt-8 pb-5 border-b border-ink-border sticky top-0 z-30">
      {back && (
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-ink-muted text-sm mb-3 hover:text-ink transition-colors -ml-1 lg:hidden">
          <span className="icon-o text-xl">arrow_back</span>
          <span className="font-display font-medium">Back</span>
        </button>
      )}
      <div className="flex items-end justify-between max-w-5xl">
        <div>
          <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-ink leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  )
}
