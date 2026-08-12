import { useCVStore } from '../../store/cvStore';

const fonts = {
  classic: 'Times New Roman, serif',
  modern:  'Arial, sans-serif',
  compact: 'Georgia, serif'
};

/* All colors are hardcoded as inline styles to prevent dark-mode color-scheme
   from bleeding into the white document preview area. */
const DOC_STYLES = {
  root:      { color: '#1a1a1a', backgroundColor: '#ffffff' },
  name:      { color: '#111111', fontSize: '22pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, padding: 0 },
  contact:   { color: '#444444', fontSize: '9.5pt', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 8px', marginTop: '6px' },
  sectionH2: { color: '#111111', fontSize: '10.5pt', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #111111', paddingBottom: '3px', marginBottom: '8px', marginTop: 0 },
  body:      { color: '#222222', fontSize: '10.5pt' },
  bold:      { fontWeight: '700', color: '#111111' },
  muted:     { color: '#555555' },
  italic:    { fontStyle: 'italic', color: '#333333' },
  link:      { color: '#1a56db', textDecoration: 'none' },
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
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={DOC_STYLES.name}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div style={DOC_STYLES.contact}>
          {personalInfo.email    && <span>{personalInfo.email}</span>}
          {personalInfo.phone    && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <span>• <a href={personalInfo.linkedin} style={DOC_STYLES.link}>
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
            </a></span>
          )}
          {personalInfo.portfolio && (
            <span>• <a href={personalInfo.portfolio} style={DOC_STYLES.link}>
              {personalInfo.portfolio.replace(/^https?:\/\/(www\.)?/, '')}
            </a></span>
          )}
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
          <h2 style={DOC_STYLES.sectionH2}>Work Experience</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={DOC_STYLES.bold}>{exp.title}</span>
                  <span style={{ ...DOC_STYLES.muted, fontSize: '9.5pt' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                  <span style={DOC_STYLES.italic}>{exp.company}</span>
                  <span style={{ ...DOC_STYLES.muted, fontSize: '9.5pt' }}>{exp.location}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul style={{ margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {education.map((edu) => (
              <div key={edu.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={DOC_STYLES.bold}>{edu.degree}</span>
                  <span style={{ ...DOC_STYLES.muted, fontSize: '9.5pt' }}>
                    {edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={DOC_STYLES.italic}>{edu.institution}</span>
                  <span style={{ ...DOC_STYLES.muted, fontSize: '9.5pt' }}>{edu.location}</span>
                </div>
                {edu.gpa && (
                  <div style={{ ...DOC_STYLES.body, fontSize: '9.5pt', marginTop: '2px' }}>GPA: {edu.gpa}</div>
                )}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {certifications.map((cert) => (
              <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={DOC_STYLES.body}>
                  <span style={DOC_STYLES.bold}>{cert.name}</span>
                  {cert.issuer && <span style={DOC_STYLES.muted}> — {cert.issuer}</span>}
                </div>
                <span style={{ ...DOC_STYLES.muted, fontSize: '9.5pt' }}>{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
