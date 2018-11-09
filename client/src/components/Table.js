import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import EnhancedTableToolbar from './TableToolbar';
import EnhancedTableHead from './TableHead';
import { Button } from '@material-ui/core';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'login',
      selected: [],
      page: 0,
      rowsPerPage: 10,
    };

    this.sortData = this.sortData.bind(this);
  }

  handleRequestSort = (event, property) => {
    console.log('handleRequestSort', event, property)
    const orderBy = property;
    let order = 'desc';
    

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    let options = {
      orderBy: orderBy,
      order: order
    }

    let sortedData = this.props.data.sort(this.sortData(options));

    this.props.setSortedData(sortedData);

    this.setState({ order, orderBy });
  };

  sortData(options){
    const { orderBy, order } = options;

    if(orderBy === 'login'){
      return order === 'desc'
        ? (a, b) => ( b.login.toLowerCase() < a.login.toLowerCase() ? -1 : 1)
        : (a, b) => ( a.login.toLowerCase() < b.login.toLowerCase() ? -1 : 1)
    }
    else if(orderBy === 'email'){
      // console.log('orderBy is by email')
      // return order === 'desc'
      //   ? (a, b) => (console.log('a', a.email, '\n b=', b.email))
      //   : (a, b) => (console.log('a', a.email, '\n b=', b.email))
      return order === 'desc'
        ? (a, b) => (b.email ? b.email < a.email ? -1 : 1 : -1)
        : (a, b) => (a.email ? a.email < b.email ? -1 : 1 : -1)
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id, githubId) => {
    // console.log('id = ', id)
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
    this.props.handleClick(id);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    // console.log('selectedindex', this.state.selected)
    const { classes, data } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table  aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(item => {
                  const isSelected = this.isSelected(item._id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, item._id, item.githubId)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={item._id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.login}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.githubId}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.url}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.score}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.phone ? 
                          item.phone 
                          :
                          <Button variant='contained' className={classes.button} type='submit' >
                            Add Phone
                          </Button>
                        }
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {item.email ?
                          item.email
                          :
                          <Button variant='contained' className={classes.button} type='submit' >
                            Add Email
                          </Button>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);