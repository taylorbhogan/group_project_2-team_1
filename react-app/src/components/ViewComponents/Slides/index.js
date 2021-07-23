import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SlideProject from './SlideProject';
import styles from './Slides.module.css';

const Slides = ({ projects, title }) => {
  const projectsForSlides = () => {
    const result = [];

    for (let i = 0; i < 20; i++) {
      result.push(projects[0]);
    }

    return result;
  };

  return (
    <>
      <div className={styles.margin}>
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{title}</h3>
            <Link to='/' className={styles.linkContainer}>
              <span className={styles.link}>Discover more </span>
              <span className={styles.icon}>
                <i class="fas fa-chevron-right"></i>
              </span>
            </Link>
          </div>
          <div className={styles.sideScroll}>
            {projects.length > 0 && projectsForSlides().map(project => (
              <SlideProject project={project} />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.border}></div>
    </>
  )
};

export default Slides;
