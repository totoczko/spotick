import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import classNames from 'classnames';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    boxShadow: 'none',
    borderTop: '1px solid #eee',
    backgroundColor: '#fafafa',
    zIndex: 1
  },
  icon: {
    color: '#2129857a'
  },
  button: {
    color: 'inherit'
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  textButton: {
    color: '#2129857a'
  }
};

class BottomAppNavigation extends React.Component {
  render() {
    const { classes, location, handleSwitch, step, camera } = this.props;

    return (
      <>
        {location.pathname !== '/add' ?
          <BottomNavigation
            className={classes.root}
          >
            <BottomNavigationAction
              className={classes.button}
              label="Home"
              icon={<NavLink
                to="/"
                activeClassName='iconactive'
                exact={true}
                className={classes.icon}
              ><HomeIcon /></NavLink>}
            />
            <BottomNavigationAction
              label="Add"
              className={classes.button}
              icon={<NavLink
                to="/add"
                activeClassName='iconactive'
                exact={true}
                className={classes.icon}
              ><AddIcon /></NavLink>}
            />
            <BottomNavigationAction
              label="Profile"
              className={classes.button}
              icon={<NavLink
                to={"/profile"}
                activeClassName='iconactive'
                exact={true}
                className={classes.icon}
              ><PersonIcon /></NavLink>}
            />
          </BottomNavigation>
          :
          <BottomNavigation
            className={classes.root}
          >
            {camera &&
              <BottomNavigationAction
                label="Profile"
                className={classNames(classes.button, classes.textButton + ' ' + (step === 1 && 'activeTextButton'))}
                onClick={handleSwitch(1)}
                icon={"Zdjęcie"}
              />
            }
            <BottomNavigationAction
              label="Profile"
              className={classNames(classes.button, classes.textButton + ' ' + (step === 2 && 'activeTextButton'))}
              icon={"Galeria"}
              onClick={handleSwitch(2)}
            />
          </BottomNavigation>
        }

      </>
    );
  }
}

BottomAppNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleSwitch: PropTypes.func,
  step: PropTypes.number,
  camera: PropTypes.bool
};

const bottomNavigationWithRouter = withRouter(BottomAppNavigation);

export default withStyles(styles)(bottomNavigationWithRouter);

