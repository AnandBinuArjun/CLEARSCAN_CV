import { useCVStore } from '../../store/cvStore';

const fonts = {
  classic: 'Times New Roman, serif',
  modern:  'Arial, sans-serif',
  compact: 'Georgia, serif'
};

/* All colors are hardcoded as inline styles to prevent dark-mode color-scheme
   from bleeding into the white document preview area. */
const DOC_STYLES = {
  root:      { color: '#111111', backgroundColor: '#ffffff' },
  name:      { color: '#111111', fontSize: '24pt', fontWeight: '700', margin: 0, padding: 0, lineHeight: 1.1 },
  jobTitle:  { color: '#333333', fontSize: '12pt', fontWeight: '400', marginTop: '4px', marginBottom: '4px' },
  contact:   { color: '#333333', fontSize: '10pt', display: 'flex', flexWrap: 'wrap', marginTop: '4px', paddingBottom: '12px', borderBottom: '1.5px solid #444444' },
  sectionH2: { color: '#111111', fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px', marginTop: 0 },
  body:      { color: '#222222', fontSize: '10.5pt' },
  bold:      { fontWeight: '700', color: '#111111' },
  muted:     { color: '#555555' },
  italic:    { fontStyle: 'italic', color: '#333333' },
  link:      { color: '#111111', textDecoration: 'none' },
};

export function CVPreview() {
  const { personalInfo, summary, experience, education, skills, projects, certifications, activeTemplate } = useCVStore();

  const fontFamily = fonts[activeTemplate] || fonts.classic;

  return (
    <div
      style={{
        ...DOC_STYLES.root,
        fontFamily,
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 36px',
        lineHeight: '1.45',
        fontSize: '10.5pt',
      }}
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <header style={{ marginBottom: '20px' }}>
        <h1 style={DOC_STYLES.name}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.jobTitle && (
          <div style={DOC_STYLES.jobTitle}>{personalInfo.jobTitle}</div>
        )}
        <div style={DOC_STYLES.contact}>
          {[
            personalInfo.location,
            personalInfo.email,
            personalInfo.phone,
            personalInfo.linkedin ? personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '') : null,
            personalInfo.portfolio ? personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '') : null
          ].filter(Boolean).map((item, i) => (
            <span key={i}>
              {i > 0 && <span style={{ margin: '0 6px' }}>|</span>}
              {item}
            </span>
          ))}
        </div>
      </header>

      {/* ── PROFESSIONAL SUMMARY ───────────────────── */}
      {summary && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={DOC_STYLES.sectionH2}>Professional Summary</h2>
          <p style={{ ...DOC_STYLES.body, textAlign: 'justify', margin: 0 }}>{summary}</p>
        </section>
      )}

      {/* ── SKILLS ────────────────────────────────── */}
      {(skills.hard.length > 0 || skills.soft.length > 0) && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={DOC_STYLES.sectionH2}>Skills</h2>
          {skills.hard.length > 0 && (
            <div style={{ ...DOC_STYLES.body, marginBottom: '3px' }}>
              <span style={DOC_STYLES.bold}>Technical: </span>
              <span style={DOC_STYLES.body}>{skills.hard.join(', ')}</span>
            </div>
          )}
          {skills.soft.length > 0 && (
            <div style={DOC_STYLES.body}>
              <span style={DOC_STYLES.bold}>Professional: </span>
              <span style={DOC_STYLES.body}>{skills.soft.join(', ')}</span>
            </div>
          )}
        </section>
      )}

      {/* ── WORK EXPERIENCE ───────────────────────── */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={DOC_STYLES.sectionH2}>Professional Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ marginBottom: '2px' }}>
                  <span style={DOC_STYLES.bold}>{exp.title}</span>
                  <span style={DOC_STYLES.bold}> — {exp.company}</span>
                </div>
                <div style={{ ...DOC_STYLES.italic, fontSize: '10pt', marginBottom: '6px' }}>
                  {exp.location} | {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', listStyleType: 'disc' }}>
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} style={DOC_STYLES.body}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION ─────────────────────────────── */}
      {education.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={DOC_STYLES.sectionH2}>Education</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ marginBottom: '2px' }}>
                  <span style={DOC_STYLES.bold}>{edu.degree}</span>
                  <span style={DOC_STYLES.bold}> — {edu.institution}</span>
                </div>
                <div style={{ ...DOC_STYLES.italic, fontSize: '10pt' }}>
                  {edu.location ? `${edu.location} | ` : ''}
                  {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PROJECTS ──────────────────────────────── */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={DOC_STYLES.sectionH2}>Projects</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                  <span style={DOC_STYLES.bold}>{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} style={{ ...DOC_STYLES.link, fontSize: '9.5pt' }}>
                      | {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                </div>
                {proj.techStack && (
                  <div style={{ ...DOC_STYLES.italic, fontSize: '9.5pt', marginBottom: '3px' }}>
                    Stack: {proj.techStack}
                  </div>
                )}
                <p style={{ ...DOC_STYLES.body, margin: 0 }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ────────────────────────── */}
      {certifications.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={DOC_STYLES.sectionH2}>Certifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {certifications.map((cert) => (
              <div key={cert.id} style={DOC_STYLES.body}>
                {cert.name}
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && <span>, {cert.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
