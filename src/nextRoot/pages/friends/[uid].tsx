import React, { useState } from 'react'
import { NextPage } from 'next'
import Menu from '../../components/menu'
import { menus } from '../../js/const'
import { PageContent } from '../../components/common/page'
import { get } from '../../js/request'
import styled from 'styled-components'
import { ResumeModel } from '../../../db/models'
import {
  PhoneOutlined,
  ToolOutlined,
  ApiOutlined,
  LaptopOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import Head from 'next/head'

import html2canvas from 'html2canvas'
import jsPdf from 'jspdf'
import { Spin } from 'antd'

enum contactMap {
  'phone' = '手机',
  'email' = '邮箱',
  'site' = '网站',
  'github' = 'Github',
}

const ResumeContent = styled('div')`
  margin: 0 auto;
  padding: 1em 0 2em;

  font-size: 16px;

  overflow-y: auto;
  overflow-x: hidden;

  .github-fork-ribbon {
    cursor: pointer;
    z-index: 998;
    &::before,
    &::after {
      box-sizing: content-box !important;
    }
  }

  &::-webkit-scrollbar {
    width: 0 !important;
  }
  & > div,
  & > section {
    margin-bottom: 16px;
  }

  h2 .anticon {
    margin-right: 4px;
  }

  .base-info {
    display: flex;
    padding-right: 48px;
    flex-wrap: wrap;
    .main {
      display: flex;
      align-items: flex-start;
      flex: 1;
      .avatar {
        height: 150px;
        width: 107px;
        background-size: cover;
        background-position: center;
        margin-right: 24px;
      }

      & > section {
        min-width: 180px;
      }

      & .avatar {
        flex-shrink: 0;
      }
    }
  }

  .skills-list {
    p {
      margin-bottom: 0.5em;
    }
  }

  .exp-item {
    padding: 0 4px;
  }
`

const renderExp = (exp: Resume.Exp) => {
  return (
    <section key={exp.company}>
      <h3>{exp.company}</h3>
      <h4>
        {exp.title}
        {exp.keywords.split(',').map((t) => (
          <span className="exp-item" key={t}>
            ✅{t}
          </span>
        ))}
      </h4>
      <p dangerouslySetInnerHTML={{ __html: exp.tasks }}></p>
    </section>
  )
}

const renderContact = (contact: Resume.Contact) => {
  return (
    <section key={contact.value}>
      <span>{contactMap[contact.type]}：</span>
      <span dangerouslySetInnerHTML={{ __html: contact.value }}></span>
    </section>
  )
}

const renderSkill = (skill: string, index: number) => {
  return (
    <p key={skill}>
      {index + 1}、{skill}
    </p>
  )
}

const renderEdu = (edu: Resume.Edu) => {
  return (
    <section key={edu.name}>
      <h3>{edu.name}</h3>
      <h4>
        {edu.duration}/{edu.subject}/{edu.level}
      </h4>
    </section>
  )
}

const Friends: NextPage<{ resume: ResumeModel }> = ({ resume }) => {
  const [loading, setLoading] = useState<boolean>(false)

  const printResume = () => {
    const domElement = document.getElementById('resume-content')
    setLoading(true)
    html2canvas(domElement, {
      onclone: (document) => {
        document.getElementById('print-button').style.visibility = 'hidden'
      },
      proxy: '/api/v1/open/proxy',
    })
      .then((canvas) => {
        const img = canvas.toDataURL('image/png')
        const { width, height } = domElement.getBoundingClientRect()
        const pdf = new jsPdf({
          unit: 'px',
          compress: true,
          format: [width, height],
        })
        pdf.addImage(img, 'JPEG', 0, 0, width, height)
        pdf.save(`${resume.nickname}-前端.pdf`)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css"
        />
      </Head>
      <Menu menus={menus} />
      <Spin spinning={loading}>
        <PageContent id="resume-content">
          <ResumeContent>
            <div
              id="print-button"
              className="github-fork-ribbon"
              data-ribbon="打印"
              title="打印"
              onClick={printResume}
            >
              打印
            </div>

            <div className="base-info">
              {/* 基本信息 */}
              <div className="main">
                <div
                  className="avatar"
                  style={{ backgroundImage: `url(${resume.user.avatar})` }}
                />
                <section>
                  <h2>{resume.nickname}</h2>
                  <h3>{resume.intro}</h3>
                </section>
              </div>

              {/* 联系方式 */}
              <section>
                <h2>
                  <PhoneOutlined />
                  联系方式
                </h2>
                <div>{resume.contact.map(renderContact)}</div>
              </section>
            </div>

            {/* 技能树 */}
            <section className="skills-list">
              <h2>
                <ToolOutlined />
                技术栈
              </h2>
              <div>{resume.skills.map(renderSkill)}</div>
            </section>
            {/* 教育经历 */}
            <section>
              <h2>
                <ApiOutlined />
                教育经历
              </h2>
              <div>{resume.education.map(renderEdu)}</div>
            </section>
            {/* 工作经历 */}
            <section>
              <h2>
                <LaptopOutlined />
                工作经历
              </h2>
              <div>{resume.experience.map(renderExp)}</div>
            </section>
            {/* 自我介绍 */}
            <section>
              <h2>
                <SmileOutlined />
                自我介绍
              </h2>
              <p dangerouslySetInnerHTML={{ __html: resume.detail }} />
            </section>
          </ResumeContent>
        </PageContent>
      </Spin>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const { uid } = ctx.query
  const resume = await get<ResumeModel>(`$/open/resumeByUser/${uid}`)
  return { props: { resume } }
}

export default Friends
