function BlogShell({ title, actions, className = "", children }) {
  return (
    <main className="page-shell">
      <section className={`blog-card ${className}`.trim()}>
        <header className="page-header">
          <h1 className="blog-title">{title}</h1>
          {actions ? <div className="page-actions">{actions}</div> : null}
        </header>
        {children}
      </section>
    </main>
  );
}

export default BlogShell;
