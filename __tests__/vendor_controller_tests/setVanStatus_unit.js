const { TestWatcher } = require('@jest/core');
const mongoose = require('mongoose')

const vendorController = require("../../controllers/vendorController")

const Van = require("../../models/van")

describe("Unit testing set van status from vendorController.js", () => {
    const req = {
        session: {passport: {user: '607ff9da3bc89852289a92ed'}},
        body: {
            textLocation:'Luna Park', 
            geolocation: {
                Latitude: '-37.83',
                Longitude: '144.99'
            },
        isAuthenticated: jest.fn().mockReturnValue('True')}
    };

    const res = {
        redirect: jest.fn(),
        send: function(){ },
        json: function(err){
            console.log("\n : " + err);
        },
        status: function(responseStatus) {
            // assert.equal(responseStatus, 404);
            // if (responseStatus === 404) {
            //     return true;
            // } else {
            //     return false;
            // }
            // This next line makes it chainable
            return this; 
        }
    };

    beforeAll(() => {

        Van.findOne = jest.fn().mockResolvedValue([{
            _id: '607ff9da3bc89852289a92ed',
            name: 'van002',
            textLocation: 'Somewhere in the world',
            geolocation: {
                Latitude: '11.11',
                Longitude: '50.50'
            },
            status: 'closed',
            __v: 0
        }]);

        Van.findOne = jest.fn().mockImplementationOnce([{
            _id: '607ff9da3bc89852289a92ed',
            name: 'van002',
            textLocation: 'Somewhere in the world',
            geolocation: {
                Latitude: '11.11',
                Longitude: '50.50'
            },
            status: 'closed',
            __v: 0
        }]);

        // Van.findOne.mockImplementationOnce(() => {
        //     jest.fn().mockReturnValue({
        //         _id: '607ff9da3bc89852289a92ed',
        //         name: 'van002',
        //         textLocation: 'Somewhere in the world',
        //         geolocation: {
        //             Latitude: '11.11',
        //             Longitude: '50.50'
        //         },
        //         status: 'closed',
        //         __v: 0
        //     })
        // })

        // const VanFindOneAndUpdateMock = jest.spyOn(Van, "findOneAndUpdate");
        // const VanFindOneAndUpdate = jest.fn((req, obj) => {
        //     expect(res.redirect).toHaveBeenCalledTimes(1);
        // })
        // VanFindOneAndUpdateMock.mockImplementation(VanFindOneAndUpdate);
        Van.findOneAndUpdate = jest.fn().mockResolvedValue([{
            _id: '607ff9da3bc89852289a92ed',
            name: 'van002',
            textLocation: 'Luna Park',
            geolocation: {
                Latitude: '-37.83',
                Longitude: '144.99'
            },
            status: 'ready-for-orders',
            __v: 0
        }])

        Van.findOneAndUpdate = jest.fn().mockImplementationOnce([{
            _id: '607ff9da3bc89852289a92ed',
            name: 'van002',
            textLocation: 'Luna Park',
            geolocation: {
                Latitude: '-37.83',
                Longitude: '144.99'
            },
            status: 'ready-for-orders',
            __v: 0
        }])

        // Van.findOneAndUpdate.mockImplementationOnce(() => {
        //     jest.fn().mockReturnValue({
        //         _id: '607ff9da3bc89852289a92ed',
        //         name: 'van002',
        //         textLocation: 'Luna Park',
        //         geolocation: {
        //             Latitude: '-37.83',
        //             Longitude: '144.99'
        //         },
        //         status: 'ready-for-orders'
        //     })
        // })

        vendorController.setVanStatus(req, res);
    })

    test("Test case 1: unit testing with van002 \
         set location to Luna Park, status to ready-for-orders", () => {
        expect(res.redirect).toHaveBeenCalledTimes(1);
        })
})