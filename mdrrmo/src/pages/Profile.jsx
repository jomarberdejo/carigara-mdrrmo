import ProfileItem from '../components/profile/Profile'
import PageIntro from '../components/pageIntro/PageIntro'
import { Container } from '@mui/material';

const Profile = () => {
  return (
      <Container >
       <PageIntro/>
      <ProfileItem/>
      </Container>
    )
}

export default Profile;