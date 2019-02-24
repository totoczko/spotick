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
import { Button } from '@material-ui/core';

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
        <BottomNavigation
          className={classes.root}
        >
          {location.pathname !== '/add' ?
            <div>
              <NavLink
                to="/"
                activeClassName='iconactive'
                exact={true}
                className={classes.icon}
              >
                <BottomNavigationAction
                  className={classes.button}
                  label="Home"
                  icon={<HomeIcon />}
                />
              </NavLink>
              <NavLink
                to="/add"
                activeClassName='iconactive'
                exact={true}
                className={classes.icon}
              >
                <BottomNavigationAction
                  label="Add"
                  className={classes.button}
                  icon={<AddIcon />}
                />
              </NavLink>
              <NavLink
                to={"/profile"}
                activeClassName='iconactive'
                exact={true}
                className={classes.icon}
              >
                <BottomNavigationAction
                  label="Profile"
                  className={classes.button}
                  icon={<PersonIcon />}
                />
              </NavLink>
            </div> :
            <div className={classes.flex}>
              {camera &&
                <Button
                  className={classes.textButton + ' ' + (step === 1 && 'activeTextButton')}
                  type="button"
                  onClick={handleSwitch(1)}
                >
                  Zdjęcie
              </Button>
              }
              <Button
                className={classes.textButton + ' ' + (step === 2 && 'activeTextButton')}
                type="button"
                onClick={handleSwitch(2)}
              >
                Galeria
            </Button>
            </div>
          }
        </BottomNavigation>
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

