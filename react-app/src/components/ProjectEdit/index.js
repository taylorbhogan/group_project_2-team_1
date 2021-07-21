import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editProject, deleteProject } from '../../store/project'
import { getCountries } from '../../store/country'
import { getCategories } from '../../store/category'
import { getSubCategories } from '../../store/subCategory'


function Project() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState([])

  const [project, setProject] = useState('')
  // const [subTitle, setSubTitle] = useState(project.subTitle)
  const [subTitle, setSubTitle] = useState(project.sub_title)
  const [categoryId, setCategoryId] = useState(project.category_id)
  const [countryId, setCountryId] = useState(project.country)
  const [subCategory, setSubCategory] = useState('Things')
  const [title, setTitle] = useState(project.title)
  const [goal, setGoal] = useState(project.funding_goal)
  const [imageUrl, setImageUrl] = useState(project.project_image_url)
  const [campaignDuration, setCampaignDuration] = useState(project.campaign_duration)

  const categories = useSelector(state => Object.values(state.categories));
  const countries = useSelector(state => Object.values(state.countries));
  const user = useSelector(state => state.session.user);
  const subCategories = useSelector(state => Object.values(state.subCategories));
  // const startingSubCat = subCategories.find(subCat => subCat.category_id === +categoryId)
  const [currentSubCategories, setCurrentSubCategories] = useState([subCategories.filter(subCat => subCat.category_id === +categoryId)])
  // if (subCategories.length) {
  //   let startingSubCats = subCategories.filter(subCat => subCat.category_id === +categoryId)
  //   console.log(startingSubCats)
  // }
  // if (startingSubCats.length) {

  //   setCurrentSubCategories(startingSubCats)
  // }
  // TODO: switch these to be their equivalents pulled from the db
  // const categories = ['Art', 'Comics', 'Crafts']
  // const subCategories = ['Stuff', 'Things']
  // const countries = ['Norway', 'New Zealand', 'Mongolia']

  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      const project = await response.json();
      // console.log(project)
      await setProject(project);
      await dispatch(getCountries())
      await dispatch(getCategories())
      await dispatch(getSubCategories())
      await setTitle(project.title)
      await setGoal(project.funding_goal)
      await setImageUrl(project.project_image_url)
      await setCampaignDuration(project.campaign_duration)
      await setSubTitle(project.sub_title)
      await setCountryId(project.country_id)
      if (categoryId != project.category_id) {
        await setCategoryId(project.category_id)
      }
      // if (categoryId != project.category_id) {
      let subCatArray = await subCategories.filter(subCat => subCat.category_id === +categoryId)
      await setCurrentSubCategories(subCatArray)

      // }




      // await setCurrentSubCategories(['testy'])


    })();
    // }, [categoryId])
  }, [])

  // useEffect(() => {

  // }, [categoryId])


  useEffect(() => {
    dispatch(getSubCategories())
    // if (categoryId != project.category_id) {

    let subCatArray = subCategories.filter(subCat => subCat.category_id === +categoryId)
    // subCategories.forEach(subCat => console.log(subCat))
    setCurrentSubCategories(subCatArray)
    // }
    // console.log("SUBCAT", subCatArray)

  }, [categoryId])
  // HANDLE SUBMIT IS NOT YET FUNCTIONAL - IN THE WORKS
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    // TODO: frontend validations
    setErrors(errors)

    const newProject = {
      ...project,
      user_id: user.id,
      title,
      sub_title: subTitle,
      category_id: categoryId,
      sub_category_id: subCategory,
      country_id: countryId,
      project_image_url: imageUrl,
      campaign_duration: campaignDuration,
      funding_goal: goal
      // category: categoryId,
      // country: countryId,
    }
    // console.log('THIS IS THE THING YOU"RE SENDING BACK **************', newProject)
    // TODO: implement the API route to handle the fetch request from editProject in the store in project.js
    let editedProject = await dispatch(editProject(newProject))

    if (editedProject) {
      history.push(`/projects/${editedProject.id}`);
    }
  }

  const handleDelete = async (projectId) => {
    const deletedProject = await dispatch(deleteProject(projectId))
    if (deletedProject) {
      history.push(`/discover`);
    }
  }

  return (
    <div>
      <div>
        <div>✍️ Basics</div>
        <div>📊 Funding</div>
        <div>🎁 Rewards</div>
        <div>📖 Story</div>
        <div>👥 People</div>
        <div>💰 Payment</div>
        <div>📢 Promotion</div>
      </div>
      <div>
        <div>
          <h1>Start with the basics</h1>
          <p>Make it easy for people to learn about your project.</p>
        </div>
        <form
          onSubmit={handleSubmit}
        >
          <div>
            <h2>Project title</h2>
            <div>Write a clear, brief title that helps people quickly understand the gist of your project.</div>
            <div>
              <label>Title</label>
              <input
                value={title}
                type="text"
                placeholder={'The Community Microscope Kit'}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
            </div>
            <div>
              <label>Subtitle</label>
              <textarea
                value={subTitle}
                placeholder={'Explore the invisible microscopic world around you with an affordable microscope kit you construct yourself.'}
                onChange={(e) => setSubTitle(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div>
            <h2>Project category</h2>
            <div>Choose the category that most closely aligns with your project.</div>
            <div>Think of where backers may look to find it. Reach a more specific community by also choosing a subcategory.</div>
            <div>You’ll be able to change the category and subcategory even after your project is live.</div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map(category =>
                <option
                  value={category.id}
                  key={category.id}>{category.name}</option>
              )}
            </select>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              {currentSubCategories.map(subCategory =>
                <option
                  value={subCategory.id}
                  key={subCategory.id}>{subCategory.name}</option>
              )}
            </select>
          </div>
          <div>
            <h2>Project location</h2>
            <p>Enter the location that best describes where your project is based.</p>
            <select
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
            >
              {countries.map(country =>
                <option
                  value={country.id}
                  key={country.id}>{country.name}</option>
              )}
            </select>
          </div>
          <div>
            <h2>Project image</h2>
            <p>Add an image that clearly represents your project. Choose one that looks good at different sizes—it’ll appear on your project page, across the Kickstarter website and mobile apps, and (when shared) on social channels.</p>
            <p>Your image should be at least 1024x576 pixels. It will be cropped to a 16:9 ratio.</p>
            <p>Avoid images with banners, badges, or text—they are illegible at smaller sizes, can be penalized by the Facebook algorithm, and decrease your chances of getting Kickstarter homepage and newsletter features.</p>
            <input
              value={imageUrl}
              type="text"
              placeholder={'enter your image url here'}
              onChange={(e) => setImageUrl(e.target.value)}
            ></input>
          </div>
          <div>
            <h2>Funding goal</h2>
            <p>Set an achievable goal that covers what you need to complete your project.</p>
            <p>Funding is all-or-nothing. If you don’t meet your goal, you won’t receive any money.</p>
            <div>
              <label>Goal amount</label>
              <input
                value={goal}
                type="text"
                placeholder={'$50,000'}
                onChange={(e) => setGoal(e.target.value)}
              ></input>
            </div>
          </div>
          <div>
            <h2>Campaign duration</h2>
            <div>
              <label>Enter number of days</label>
              <input
                value={campaignDuration}
                type="text"
                placeholder={'30'}
                onChange={(e) => setCampaignDuration(e.target.value)}
              ></input>
            </div>
          </div>
          <div>
            <button
              type="submit"
            >Save</button>
          </div>
        </form>
        <div>
          <button
            onClick={() => handleDelete(projectId)}
          >
            Delete
          </button>
        </div>
        {/* the below is left over from earlier testing; it can be deleted whenever  */}
        <ul>
          <li>
            <strong>Project Id</strong> {projectId}
          </li>
          <li>
            <strong>Project SubTitle</strong> {project.subTitle}
          </li>
          <li>
            <strong>Project Category</strong> {project.category}
          </li>
          <li>
            <strong>Project Country</strong> {project.country}
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Project;
