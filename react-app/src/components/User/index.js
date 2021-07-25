import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserProjectView from './UserProjectView';
import SlideProject from '../ViewComponents/Slides/SlideProject';
import styles from './User.module.css'
import SmallUserImage from './SmallUserImage';
import LargeUserImage from './LargeUserImage';

function User() {
  const [user, setUser] = useState({});
  const { userId }  = useParams();
  const [showBackedProjects, setShowBackedProjects] = useState(true)
  const [backings, setBackings] = useState([])

  const projects = user.projects
  console.log(projects);

  useEffect(() => {
    if (!userId) {
      return;
    }
    (async () => {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      setUser(user);

      const backingsResponse = await fetch(`/api/backings/users/${userId}`)
      const backingsData = await backingsResponse.json();
      setBackings(backingsData.user_backed_projects)

    })();
  }, [userId]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <div className={styles.topColumnFlex}>
        <div className={styles.headsUpDiv}>
          <div className={styles.visibilityText}><span><i class="fas fa-eye"></i></span>  This profile page is visible only to you.</div>
          <button className={styles.btn}>Manage your privacy settings</button>
        </div>
        <div className={styles.avatarDiv}>
          <div className={styles.dummyAvatar}>
            <LargeUserImage />
          </div>
        </div>
        <div className={styles.userInfoDiv}>
          <div className={styles.usernameDiv}>{user.username}</div>
          <div className={styles.userInfo}>
            {backings.length === 1 && <span>Backed {backings.length} project · Joined Jul 2021</span>}
            {backings.length > 1 && <span>Backed {backings.length} projects · Joined Jul 2021</span>}
            </div>
        </div>
      </div>
      <div className={styles.bottomColumnFlex}>
        <div className={styles.aboutOrBacked}>
          <div>
            <button
              onClick={() => setShowBackedProjects(false)}
              className={styles.setShowBackedProjectsButton}
              >
              <div className={styles.greenBarTopper}>About</div>
              {(!showBackedProjects && <div className={styles.greenBar}></div>)}
            </button>
          </div>
          <div>
            <button
              onClick={() => setShowBackedProjects(true)}
              className={styles.setShowBackedProjectsButton}
              >
              <div className={styles.greenBarTopper}>Backed</div>
              {(showBackedProjects && <div className={styles.greenBar}></div>)}
            </button>
          </div>
        </div>
        {(!showBackedProjects &&
          <div className={styles.showUser}>
            <div className={styles.showUserInnerDiv}>
              <div className={styles.showUserInnerDivHeader}>Biography</div>
              <div>
                <div className={styles.showUserInnerDivText}>Let people know more about you.</div>
                <div>Add a biography</div>
              </div>
            </div>
            <div className={styles.showUserInnerDiv} id={styles.websites}>
              <div className={styles.showUserInnerDivHeader}>Websites</div>
              <div>Add websites</div>
            </div>
          </div>
        )}
        {(showBackedProjects &&
          <div className={styles.slideProjectDiv}>
          {backings?.map((project) => <SlideProject key={project.id} project={project} />)}
          </div>
        )}
      </div>
    </div>

  );
}
export default User;
